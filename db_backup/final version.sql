PGDMP      1        	        |            ssh    16.2    16.2 L    K           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            L           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            M           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            N           1262    17651    ssh    DATABASE        CREATE DATABASE ssh WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE ssh;
                postgres    false            �            1259    17689 
   categories    TABLE     �   CREATE TABLE public.categories (
    category_id integer NOT NULL,
    supermarket_id integer,
    name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    17688    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false    222            O           0    0    categories_category_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;
          public          postgres    false    221            �            1259    17653 
   households    TABLE     �   CREATE TABLE public.households (
    household_id integer NOT NULL,
    address text NOT NULL,
    pin_password text NOT NULL
);
    DROP TABLE public.households;
       public         heap    postgres    false            �            1259    17652    households_household_id_seq    SEQUENCE     �   CREATE SEQUENCE public.households_household_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.households_household_id_seq;
       public          postgres    false    216            P           0    0    households_household_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.households_household_id_seq OWNED BY public.households.household_id;
          public          postgres    false    215            �            1259    17733    order_items    TABLE     �  CREATE TABLE public.order_items (
    item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    user_id integer,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    delivery_fee_share numeric(10,2),
    service_fee_share numeric(10,2),
    user_total numeric(10,2),
    tax_share numeric(10,2) DEFAULT 0
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    17732    order_items_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.order_items_item_id_seq;
       public          postgres    false    228            Q           0    0    order_items_item_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.order_items_item_id_seq OWNED BY public.order_items.item_id;
          public          postgres    false    227            �            1259    17713    orders    TABLE     �  CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    household_id integer,
    is_shared boolean DEFAULT false,
    total_cost numeric(10,2),
    delivery_fee numeric(10,2),
    service_fee numeric(10,2),
    status character varying(20) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_date date NOT NULL,
    tax numeric(10,2) DEFAULT 0
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    17712    orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_order_id_seq;
       public          postgres    false    226            R           0    0    orders_order_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;
          public          postgres    false    225            �            1259    17755    payments    TABLE     2  CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id integer,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying,
    transaction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_amount_nonzero CHECK ((amount <> (0)::numeric)),
    CONSTRAINT chk_status_valid CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'SUCCESS'::character varying])::text[])))
);
    DROP TABLE public.payments;
       public         heap    postgres    false            �            1259    17754    payments_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.payments_payment_id_seq;
       public          postgres    false    230            S           0    0    payments_payment_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;
          public          postgres    false    229            �            1259    17703    products    TABLE     >  CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category character varying(50),
    image_url text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    supermarket_id integer
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    17702    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    224            T           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    223            �            1259    17680    supermarkets    TABLE     �   CREATE TABLE public.supermarkets (
    supermarket_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    rating numeric(3,2),
    image_url text
);
     DROP TABLE public.supermarkets;
       public         heap    postgres    false            �            1259    17679    supermarkets_supermarket_id_seq    SEQUENCE     �   CREATE SEQUENCE public.supermarkets_supermarket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.supermarkets_supermarket_id_seq;
       public          postgres    false    220            U           0    0    supermarkets_supermarket_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.supermarkets_supermarket_id_seq OWNED BY public.supermarkets.supermarket_id;
          public          postgres    false    219            �            1259    17662    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    household_id integer,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    pin_password text,
    phone_number character varying(15),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_blocked boolean DEFAULT false,
    balance numeric DEFAULT 0 NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    17661    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    218            V           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    217            y           2604    17692    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    222    221    222            s           2604    17656    households household_id    DEFAULT     �   ALTER TABLE ONLY public.households ALTER COLUMN household_id SET DEFAULT nextval('public.households_household_id_seq'::regclass);
 F   ALTER TABLE public.households ALTER COLUMN household_id DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    17736    order_items item_id    DEFAULT     z   ALTER TABLE ONLY public.order_items ALTER COLUMN item_id SET DEFAULT nextval('public.order_items_item_id_seq'::regclass);
 B   ALTER TABLE public.order_items ALTER COLUMN item_id DROP DEFAULT;
       public          postgres    false    227    228    228            |           2604    17716    orders order_id    DEFAULT     r   ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
 >   ALTER TABLE public.orders ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    17758    payments payment_id    DEFAULT     z   ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);
 B   ALTER TABLE public.payments ALTER COLUMN payment_id DROP DEFAULT;
       public          postgres    false    230    229    230            z           2604    17706    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    224    223    224            x           2604    17683    supermarkets supermarket_id    DEFAULT     �   ALTER TABLE ONLY public.supermarkets ALTER COLUMN supermarket_id SET DEFAULT nextval('public.supermarkets_supermarket_id_seq'::regclass);
 J   ALTER TABLE public.supermarkets ALTER COLUMN supermarket_id DROP DEFAULT;
       public          postgres    false    220    219    220            t           2604    17665    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    218    217    218            @          0    17689 
   categories 
   TABLE DATA           G   COPY public.categories (category_id, supermarket_id, name) FROM stdin;
    public          postgres    false    222   r`       :          0    17653 
   households 
   TABLE DATA           I   COPY public.households (household_id, address, pin_password) FROM stdin;
    public          postgres    false    216   .a       F          0    17733    order_items 
   TABLE DATA           �   COPY public.order_items (item_id, order_id, product_id, user_id, quantity, unit_price, subtotal, delivery_fee_share, service_fee_share, user_total, tax_share) FROM stdin;
    public          postgres    false    228   
b       D          0    17713    orders 
   TABLE DATA           �   COPY public.orders (order_id, user_id, household_id, is_shared, total_cost, delivery_fee, service_fee, status, created_at, delivery_date, tax) FROM stdin;
    public          postgres    false    226   rb       H          0    17755    payments 
   TABLE DATA           c   COPY public.payments (payment_id, order_id, user_id, amount, status, transaction_date) FROM stdin;
    public          postgres    false    230   c       B          0    17703    products 
   TABLE DATA           y   COPY public.products (product_id, name, description, price, category, image_url, updated_at, supermarket_id) FROM stdin;
    public          postgres    false    224   �c       >          0    17680    supermarkets 
   TABLE DATA           \   COPY public.supermarkets (supermarket_id, name, description, rating, image_url) FROM stdin;
    public          postgres    false    220   �u       <          0    17662    users 
   TABLE DATA           �   COPY public.users (user_id, household_id, first_name, last_name, email, password_hash, pin_password, phone_number, address, created_at, is_blocked, balance) FROM stdin;
    public          postgres    false    218   w       W           0    0    categories_category_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.categories_category_id_seq', 150, true);
          public          postgres    false    221            X           0    0    households_household_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.households_household_id_seq', 3, true);
          public          postgres    false    215            Y           0    0    order_items_item_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.order_items_item_id_seq', 6, true);
          public          postgres    false    227            Z           0    0    orders_order_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.orders_order_id_seq', 7, true);
          public          postgres    false    225            [           0    0    payments_payment_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.payments_payment_id_seq', 12, true);
          public          postgres    false    229            \           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);
          public          postgres    false    223            ]           0    0    supermarkets_supermarket_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.supermarkets_supermarket_id_seq', 1, false);
          public          postgres    false    219            ^           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);
          public          postgres    false    217            �           2606    17694    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    222            �           2606    17696 -   categories categories_supermarket_id_name_key 
   CONSTRAINT     x   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_supermarket_id_name_key UNIQUE (supermarket_id, name);
 W   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_supermarket_id_name_key;
       public            postgres    false    222    222            �           2606    17660    households households_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (household_id);
 D   ALTER TABLE ONLY public.households DROP CONSTRAINT households_pkey;
       public            postgres    false    216            �           2606    17738    order_items order_items_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (item_id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    228            �           2606    17721    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    226            �           2606    17762    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            postgres    false    230            �           2606    17711    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    224            �           2606    17687    supermarkets supermarkets_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.supermarkets
    ADD CONSTRAINT supermarkets_pkey PRIMARY KEY (supermarket_id);
 H   ALTER TABLE ONLY public.supermarkets DROP CONSTRAINT supermarkets_pkey;
       public            postgres    false    220            �           2606    17673    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    218            �           2606    17671    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            �           1259    17788    idx_order_id    INDEX     E   CREATE INDEX idx_order_id ON public.payments USING btree (order_id);
     DROP INDEX public.idx_order_id;
       public            postgres    false    230            �           1259    17789    idx_transaction_date    INDEX     U   CREATE INDEX idx_transaction_date ON public.payments USING btree (transaction_date);
 (   DROP INDEX public.idx_transaction_date;
       public            postgres    false    230            �           1259    17787    idx_user_id    INDEX     C   CREATE INDEX idx_user_id ON public.payments USING btree (user_id);
    DROP INDEX public.idx_user_id;
       public            postgres    false    230            �           2606    17697 )   categories categories_supermarket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_supermarket_id_fkey FOREIGN KEY (supermarket_id) REFERENCES public.supermarkets(supermarket_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_supermarket_id_fkey;
       public          postgres    false    4751    222    220            �           2606    17782    payments fk_order    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 ;   ALTER TABLE ONLY public.payments DROP CONSTRAINT fk_order;
       public          postgres    false    4759    226    230            �           2606    17777    payments fk_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 :   ALTER TABLE ONLY public.payments DROP CONSTRAINT fk_user;
       public          postgres    false    230    218    4749            �           2606    17739 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    226    4759    228            �           2606    17744 '   order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          postgres    false    4757    224    228            �           2606    17749 $   order_items order_items_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_user_id_fkey;
       public          postgres    false    228    4749    218            �           2606    17727    orders orders_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_household_id_fkey;
       public          postgres    false    226    4745    216            �           2606    17722    orders orders_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public          postgres    false    226    218    4749            �           2606    17763    payments payments_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_order_id_fkey;
       public          postgres    false    230    226    4759            �           2606    17768    payments payments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_user_id_fkey;
       public          postgres    false    4749    218    230            �           2606    17674    users users_household_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_household_id_fkey FOREIGN KEY (household_id) REFERENCES public.households(household_id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_household_id_fkey;
       public          postgres    false    218    4745    216            @   �   x�M��
�0�����Hgri��Wn��Rm|{4ig���!�������!/���3;��wz<g��)�ӏt��<�O"i��w8˸ױ4�!W碰ً�]��R�)D�[��m��]=����
���
��:ܥ�.� �B��Z�:ܵ��k�5�^���uYj�      :   �   x�M�Kr�0  �59���d)�PR0P���Fhj0�����w��L|7o�V�㑣��w�냘j�
%�]wq�UښR<N��(�K���I8<��N�x���	¥��{y��a��f\�S�^,��J�4Y��f����C��#��S��Q� �y���z��l�;�`�ߤ-M�}���3���e�_�d��5|E�*55�KpX  �.C      F   X   x�����0���B������)��8򁃠���C�+�U",F.����:2滌�x��\`��uo �[^�T� �%�      D   �   x���1AК9�X�a����kX��F����h�B7�!!��$�������t�]�e]ΤP�D'���3��E{���^b�����b�rU���/3�N�G�侬�� �̆��Yl���$�@��Obh��w+;q)�Y�L�      H   �   x��лm1�X��,��GU�+��w�v��a[���8���ZqJ����~>~���~@�7��*�գ;�	�ub�#M���5C�]�����)}��ID)������S�����ƹ�S���W�X@��:;CX6�ח��@]	���Q�	cT���^7&�_��i      B      x����r���������� 8�]���m��g�i'7 K��W��k?}AP�[I�^k5�H&v�Z8"�|�|��O���/��������[.�&v7��~��m.n�ׅ�.�B�7ۛ�r1s�溜Uw��ߜ~���8���~�-��4���D�7���ʯ�JD�ⷿ���m���2+?s6BB�x���g�n����'+r��/Ӑ�T|��~2p̗� $�*�_|\<i��^c�����_m�^"p���$�)~X���oB�q9�As�c���x��1��s�ȶ�i7�^�(+�(7� $T��]�ͯ�P�@��9P�3w�G��q�;(Q�w�u����:һYP��6�~8����Io���2�O��î�]����3jP�ew�~�]52� �A�u�_.'�~��|���/�C7[����
_��7�a��4��ow��|�\ %*���H�A.��f���%�����4�o���ns@��㟏��rH�Y.>,7�ρ�+p?����K���nvk$]�a� Z|{3�Y͐�O��ߎ�X�]��!���_�����Y߯'��[��
��ǩ�q*ԣ*~Z/^	�n .��8ʮ��ѡ;l��=��8Jo��ý��������O��\������\�]��q�X���e�;�qBoIe���j�nE]�Ϸ#��U����d���������~��o������f>N��M�z�ī�|2�N����'��M*��f>=Μ�΄��xg�8%Z�a�XKOş��W�e���" Va|\��΃:T����f�Mf���0d.O��qP���q��b��9�����æ�aPzS��V}��>�	Y��i"�I�Żxf&d�3�l�w�n�
���4�\H�K�f;���89��$(W�����]{?�9��0l:�ҵx�-Ç�����[8��8qz7�a��~߭����f<ߢAb?Λ��AR�ˮ[,'�	���p8Κ������]92���i�,^�o�����n����Μ��>��7�q���?\����Qv�f�=��A�}�����m�A����iԡ��|�w+��
�aП)�w������x��8J�:\m>�v�r�9�%�2j�wM��n5\E���H�Z�̓ZX��9�QH�:���s������O�
8���(�����N���a�W�yù���������8�c��~�ax/���p�~E��s��pG��}?���iѠ-�����&�?Hy�'� ��i6�A�Y�]����l~�6�K����#&���]~��
��_|�:\}���p�O��\��~i��nv_��lSqmNs�6�w��'*(� �vݯ��;�����V`��'�8jQ�Z�n<7�n�a,2���SZ�}�c�dbQ�]�ĺ)�vs|QzbC�"	\�ߏ3���^�o[̟��x�����F����<�}�D��Z|+�)o{l��j}�
�$Զk#'J���k���,oB�:>W쯆�o� ����P��=z���~�\���@(?��}�p���}_(�v�y��u���b}�v�����s�65_�炯����P��j2�_��~մ8�E��U.Q ��D�,0��E�VV�r#Q�`ˋ���p���!,/~��5
a��U97���2O9����AX�e!,� a�%ay���J �j�a��BXP	�j������&����w��
@XX�jk��-��a!,(�����AXH>a�m *p�c
� SXR
�a!�8|$���OpXRZĂZ� ���#��8�%eŢXHŒ��X��,��M��`,)3Gc�-(KʖƱ�4�%R�<�ׁ屆�s@�W��D4@dyD��/
��J�H�H"�,� �d�T���P�H�QY^6Ge�4,����D2�e�5X.��7��
P`�h ��
2KT`4�=�%�4���l���pX��DIg�PbB���,,ųD������,ц��"�%�B�)@Z�-�h9�0�%V�����2ZbBCZ@4i�)Ei98JK�XL�ɧ1-�DrZN���HP+ �Zbu��ޣ^�kb�����2Ak!%P\K��y-� 	lI*C�\�B�$I�٢��և�<��T!�-I��"�f�� ��&�$U1v/�93RM�[Hߒ԰�R��$e��B*0���a��x⒪�Q\p�Jp���,ZR1�󉴤�UZgviI�شΧӒ
j�˨%��:�TK*\�u.��T�Y�lj-����Z5��:�_��[g3lդb뼎���l�۲U󚭳{�jV�un�VD�%/�ڪi�V��mլn����jR���o��r,��^�P�-��}���-,�@��!�[P��&���J��W�ɷ�8�Ր�-(���V�`ȯ&���j��WCJ����iԀ��rD�%/`�Sq]"�W&e\~��ʼ�˭�`�r�%h,�J.���刔�-a�2��r[�Xf�\~�k5��N``-)�r�I������]~�k9E�ۀC�ڈ���a�Z\�%g�tIˋ��� ��.������퀢Z��.� 
�iv�-8"l�U��0H�����k@1aZ��./�´D�]^$J�iɫ��lӒ�wy8.LKZ����0-Y��W�%�TX�� F�T�/y��JP�E���0F䅔@�0���)@�a*1�\�B�Tb:/��a�z!UH4L%��_V"����Vj��2�V�*+�B�0h�*��B*Ph�*+�B*0h�*��B�a4L5(��[ph�*����9�T	ɗ��a������0UB���h���rSQ4L�}��0���PSÅ_n(����/7���.�rc�'-��_H(��_������U���F˿�
,����84LSD &/` �D+������A4L���7)"KP_ǘ(� �B�D���|�+��0_��a%دe�`P��+R	�_HX�N0� ��UH
��`���"�`PӊւA4L��L^@�ULt	�aZ�f0���iū��
4�5�sK�h�֤�m��aZG�`n� �5�s[�h�֬�o��aZ3�0?Gô&an8��iQ��%h�ּ#����aZs�0���i���h�6�&L��	ӆ��y�<�/
C[�h�6�)� ��
�hXr��-H4�	���&�P�0���5�.���Ѱ��¼H˼0�&Ѱ�ü$�ie�W�G�2��*�hXf�a`�Ak���5Ls�F�!а�XÐ0��0� ���1k\�C�ژ5�j�oX�kR�E�ڈ5/Bl��kބ��n��0���۲�0�����5���a-kC*PhXKYÐx�2h�[ph���5L�f������8f%k��94�J���h���5�ME�0+qk�
�aV��0?Dìĭan(��YIX��X��j�[��X�I���!���Z8k��</���0?�C�Lhk�[�E�LHk�ۀC�L"�0}k�	m�jh�	k�*h�	i��7�kX�A�L)k� �R4��aX>�����0����F�aX	3�aP3%�aP<C���0� �����aX3%�aP3��aP3�X���af1k�%�����0������0������0������0����E�an� f�Z��$f�Z��f�����8f�����f)bsK�0K�5����a�8k�ۀB�,E�an� f	���٬a�xk��Σa�xk�G�,��0�
gXEZ��(fU����0��0�	��YEYüfl�ra4�*��E�h�U�5���0�8k�׀Cì��a^����yX4�j�6��0���0}k��Ak�Gìf�aH	�:`C
�h��1k\�Bì�Yè6��e��!UH4��5/Bl��kބ��n��0���۰�0���YC[Ð
fkC*0h�5�5��Ѱ&h�[�hX�[��l�0kk�K�ak��I4�!�an8��e���hXƭan(��e�懢hXƭan(��e����Ռ[��X�I+��0$�Zg��S������$�ik�[�F �  �Z��6 Ѱ6b���YK[ðֲ�0�����5, �ߴkX�B�Z��5@�[���3hXKZà�F�aX	K%g�:�hX*Ik��P�d�aPKe��� ѰT��0�������A4,�k���5,�1k�%�������5(4,��5̭@�aIhk�[�EÒ��0���%�X��4,	ks[�hX��7�а$�5�O�Ѱ$�5��а$k�["��%�a~K�Y���4bs;а��5L�fK�[ütK�[��8�����P8#)i�hXҐ5l��aI�0�	��%��a^
K
[ü\K�ZüHK�[ÐlK�Yü����yh4,k�*�hX2�6�ѰdAk���5,Y�F��Ѱd�5)��a��0� ������U(4,��5�joX���!UH4,��5/�o�����M�-씂�0��՛kC�0hXJ�5�@�a)��0����DYÐxKU���а�^�z��`� �      >   $  x����J�0�s���j�UE�ӲȂ'/�tچ�I�L���m�u�c/!��fn�a�w��4��Z���������6�� �OY�nr���1�F-��H�35`��wV�����g�3=]���"�N̏����iAFh��/H+��,�`;h��[���z���+
'�m��X,h�
��K�1huz&���b��V���ON�g1@�+��p�a�`ŧ4&��VZ�"�OR���P���ɒ�+�g�b���s-�<.
��5�\���$.�W�9�&E�      <     x�u��n�@  ��W���u_<�T�+u����j�*
nE��5i{h��\'0 ��i~��::F��G�\��k�?�پ�\��
�6�sՐm=^��M*1�Q�%�����j|#X,*b/�⌯�/_̷t+��0�a�-����5u�*��DX��=a�g��d�2
v�B��0���3��g�Kgl�ET^a��Up���\��^˒��6ڭpk_���O\~0�ter*�ɻ���"ZC�ǰ���j�m�dIT��q�~"���AJ�i�g���4���f�     